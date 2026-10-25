const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');

const file = path.join(__dirname, '../stash/overrides/bilibili.stoverride');
const config = JSON.parse(execFileSync('ruby', [
  '-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV.fetch(0)))', file,
], { encoding: 'utf8' }));
const dmView = 'https://grpc.biliapi.net/bilibili.community.service.dm.v1.DM/DmView';
const view = 'https://grpc.biliapi.net/bilibili.app.viewunite.v1.View/View';
const dmSegment = 'https://grpc.biliapi.net/bilibili.community.service.dm.v1.DM/DmSegMobile';

function frame(message = Buffer.alloc(0), compressed = false) {
  const payload = compressed ? zlib.gzipSync(message) : Buffer.from(message);
  const header = Buffer.alloc(5);
  header[0] = compressed ? 1 : 0;
  header.writeUInt32BE(payload.length, 1);
  return new Uint8Array(Buffer.concat([header, payload]));
}

async function execute(direction, options = {}) {
  const logs = [];
  const requests = [];
  let calls = 0;
  let finish;
  const completed = new Promise((resolve) => { finish = resolve; });
  const context = {
    Uint8Array, ArrayBuffer, DataView, TextEncoder, TextDecoder, URL,
    console: { log(...args) { logs.push(args.join(' ')); } },
    $environment: { 'stash-version': '3.6' },
    $argument: JSON.stringify({
      displayUpList: 'auto', purifyComment: 1, sponsorBlock: '#', logLevel: '4',
      ...options.argument,
    }),
    $request: {
      url: options.url || (direction === 'request' ? view : dmView),
      method: 'POST',
      headers: { 'content-type': 'application/grpc', te: 'trailers' },
      body: options.requestBody || frame(),
    },
    $persistentStore: { read() { return null; }, write() { return true; } },
    $notification: { post() {} },
    $done(value) { calls += 1; finish(value); },
    $httpClient: {},
  };
  for (const method of ['get', 'post', 'put', 'delete', 'head', 'options', 'patch']) {
    context.$httpClient[method] = (request, callback) => {
      requests.push({ method, ...request });
      if (request.url.startsWith('https://bsbsb.top/')) {
        callback(null, { status: 200, headers: {} }, '[]');
      } else {
        callback(null, {
          status: 200,
          headers: { 'content-type': 'application/grpc', 'content-length': '999' },
          ...options.fetchedResponse,
        }, options.fetchedBody || frame());
      }
    };
  }
  if (direction === 'response') {
    context.$response = {
      status: 200,
      headers: { 'content-type': 'application/grpc' },
      body: options.responseBody || frame(),
    };
  }
  const payload = config['script-providers'][`sparkle-bilibili-protobuf-${direction}`].payload;
  vm.runInNewContext(payload, context, { timeout: 2000 });
  let timer;
  try {
    const value = await Promise.race([
      completed,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Missing $done')), 2000); }),
    ]);
    await new Promise(setImmediate);
    assert.equal(calls, 1, '$done must run exactly once');
    return { value, logs, requests };
  } finally {
    clearTimeout(timer);
  }
}

test('every HTTP script resolves its provider and its regular expression compiles', () => {
  for (const script of config.http.script) {
    const provider = config['script-providers'][script.name];
    assert.ok(provider, script.name);
    new RegExp(script.match);
    if (script.argument) JSON.parse(script.argument);
    if (provider.payload) new vm.Script(provider.payload);
  }
  assert.ok(config.author.includes('kokoryh'));
});

test('static JSON responses are valid and gRPC mocks preserve their frame lengths', () => {
  for (const mock of config.http.mock) {
    new RegExp(mock.match);
    if (mock.text) JSON.parse(mock.text);
    if (mock.base64) {
      const body = Buffer.from(mock.base64, 'base64');
      assert.equal(body[0], 0);
      assert.equal(body.readUInt32BE(1), body.length - 5);
      assert.equal(mock.headers['grpc-status'], '0');
    }
  }
});

test('tracker jq rewrite routes every nested tracker to the blocked host', () => {
  const rewrite = config.http['body-rewrite'].find((value) => value.includes('pd-proxy'));
  const expression = rewrite.split(' response-jq ')[1];
  const result = JSON.parse(execFileSync('jq', [expression], {
    input: JSON.stringify({ data: { trackers: ['tracker1', 'tracker2'] } }), encoding: 'utf8',
  }));
  assert.deepEqual(result.data.trackers, ['stun.chat.bilibili.com:3478', 'stun.chat.bilibili.com:3478']);
});

test('channel jq rewrite removes TIP and promotional banners while keeping normal modules', () => {
  const expression = config.http['body-rewrite'][3].split(' response-jq ')[1];
  const organic = { url: 'https://www.bilibili.com/video/BV1test' };
  const result = JSON.parse(execFileSync('jq', [expression], {
    input: JSON.stringify({ data: { modules: [
      { type: 'TIP' },
      { type: 'BANNER', module_data: { items: [{ url: 'https://www.bilibili.com/blackboard/era/ad' }, organic] } },
      { type: 'NORMAL', id: 'retained' },
    ] } }), encoding: 'utf8',
  }));
  assert.deepEqual(result.data.modules, [
    { type: 'BANNER', module_data: { items: [organic] } },
    { type: 'NORMAL', id: 'retained' },
  ]);
});

test('uncompressed Protobuf response runs with only documented Stash globals', async () => {
  const { value, logs } = await execute('response');
  assert.deepEqual(Array.from(value.body), [0, 0, 0, 0, 0]);
  assert.deepEqual(logs, []);
});

test('compressed Protobuf response is decoded and returned as an uncompressed gRPC frame', async () => {
  const { value, logs } = await execute('response', { responseBody: frame(Buffer.alloc(0), true) });
  assert.deepEqual(Array.from(value.body), [0, 0, 0, 0, 0]);
  assert.deepEqual(logs, []);
});

test('invalid gzip fails open without replacing the response', async () => {
  const { value, logs } = await execute('response', { responseBody: new Uint8Array([1, 0, 0, 0, 1, 0]) });
  assert.equal(Object.keys(value).length, 0);
  assert.ok(logs.length > 0);
});

test('gzip advertising a decoded body over 4 MiB fails open', async () => {
  const body = frame(Buffer.alloc(0), true);
  new DataView(body.buffer).setUint32(body.length - 4, 4194305, true);
  const { value } = await execute('response', { responseBody: body });
  assert.equal(Object.keys(value).length, 0);
});

test('request interception handles compressed upstream data and supplies a Stash response', async () => {
  const { value, logs, requests } = await execute('request', { fetchedBody: frame(Buffer.alloc(0), true) });
  assert.equal(requests[0].url, view);
  assert.equal(requests[0]['binary-mode'], true);
  assert.equal(value.response.status, 200);
  assert.equal(value.response.headers['grpc-status'], '0');
  assert.equal(value.response.headers['content-length'], undefined);
  assert.deepEqual(Array.from(value.response.body), [0, 0, 0, 0, 0]);
  assert.deepEqual(logs, []);
});

test('synthetic response carries gRPC trailers into headers instead of returning unsupported fields', async () => {
  const { value } = await execute('request', {
    fetchedResponse: { h2_trailers: { 'grpc-status': '0', 'grpc-message': 'OK' } },
  });
  assert.equal(value.response.headers['grpc-message'], 'OK');
  assert.equal(value.response.h2_trailers, undefined);
});

test('SponsorBlock HTTP lookup uses the chosen Stash proxy policy', async () => {
  // DmSegMobileReq: pid=1, oid=2, type=1; all three are protobuf varints.
  const { value, logs, requests } = await execute('request', {
    url: dmSegment,
    requestBody: frame(Buffer.from([8, 1, 16, 2, 24, 1])),
    argument: { airbornePolicy: '节点 1' },
  });
  const lookup = requests.find((request) => request.url.startsWith('https://bsbsb.top/'));
  assert.ok(lookup);
  assert.equal(lookup.headers['X-Stash-Selected-Proxy'], encodeURIComponent('节点 1'));
  assert.equal(value.response.status, 200);
  assert.deepEqual(logs, []);
});
