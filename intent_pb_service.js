// package: intent
// file: intent.proto

var intent_pb = require("./intent_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var IntentService = (function () {
  function IntentService() {}
  IntentService.serviceName = "intent.IntentService";
  return IntentService;
}());

IntentService.ParseIntent = {
  methodName: "ParseIntent",
  service: IntentService,
  requestStream: false,
  responseStream: false,
  requestType: intent_pb.ParseIntentRequest,
  responseType: intent_pb.ParseIntentResponse
};

exports.IntentService = IntentService;

function IntentServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

IntentServiceClient.prototype.parseIntent = function parseIntent(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(IntentService.ParseIntent, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.IntentServiceClient = IntentServiceClient;

