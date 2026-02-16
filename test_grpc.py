import grpc
import intent_pb2
import intent_pb2_grpc

def run():
    print("Attempting to connect to gRPC server at localhost:50051...")
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = intent_pb2_grpc.IntentServiceStub(channel)
        
        test_command = "Navigate to the grocery store"
        print(f"Sending command: '{test_command}'")
        
        try:
            response = stub.ParseIntent(intent_pb2.ParseIntentRequest(transcribed_text=test_command))
            print("Client received:")
            print(f"Intent: {response.intent}")
            print(f"Destination: {response.destination}")
            print(f"Confidence: {response.confidence}")
            print(f"Timestamp: {response.timestamp}")
        except grpc.RpcError as e:
            print(f"gRPC Error: {e.code()} - {e.details()}")

if __name__ == '__main__':
    run()
