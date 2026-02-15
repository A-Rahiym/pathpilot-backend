import grpc
import intent_pb2
import intent_pb2_grpc

class IntentServiceClient:
    """A client for the Intent Service."""

    def __init__(self, host='localhost', port=50051):
        """Initialize the client with the server address."""
        self.address = f'{host}:{port}'
        self.channel = grpc.insecure_channel(self.address)
        self.stub = intent_pb2_grpc.IntentServiceStub(self.channel)

    def parse_intent(self, text):
        """
        Send a voice command transcription to the server and get the structured intent.
        
        Args:
            text (str): The transcribed text from the voice command.
            
        Returns:
            intent_pb2.ParseIntentResponse: The structured response from the server.
        """
        request = intent_pb2.ParseIntentRequest(transcribed_text=text)
        try:
            return self.stub.ParseIntent(request)
        except grpc.RpcError as e:
            print(f"gRPC Error: {e.code()} - {e.details()}")
            return None

    def close(self):
        """Close the connection channel."""
        self.channel.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

if __name__ == '__main__':
    import sys
    
    with IntentServiceClient() as client:
        # Check if a command was passed as an argument
        if len(sys.argv) > 1:
            # Join all arguments into a single string
            cmd = " ".join(sys.argv[1:])
            print(f"\nSending command: '{cmd}'")
            response = client.parse_intent(cmd)
            if response:
                print(f"Parsed Intent: {response.intent}")
                print(f"Destination: {response.destination or 'None'}")
                print(f"Category: {response.category or 'None'}")
                print(f"Confidence: {response.confidence:.2f}")
                print(f"Original Text: {response.original_text}")
                print(f"Timestamp: {response.timestamp}")
            else:
                print("Failed to get response from server.")
        else:
            # Default test commands if no argument is provided
            test_commands = [
                "Navigate to the nearest pharmacy",
                "What's around me?",
                "Stop navigation",
                "Help me find my way to the coffee shop"
            ]
            
            for cmd in test_commands:
                print(f"\nSending command: '{cmd}'")
                response = client.parse_intent(cmd)
                if response:
                    print(f"Parsed Intent: {response.intent}")
                    print(f"Destination: {response.destination or 'None'}")
                    print(f"Category: {response.category or 'None'}")
                    print(f"Confidence: {response.confidence:.2f}")
                    print(f"Original Text: {response.original_text}")
                    print(f"Timestamp: {response.timestamp}")
                else:
                    print(f"Failed to get response for: {cmd}")
