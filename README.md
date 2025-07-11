# S3 TypeScript Example

A complete example of AWS S3 integration using TypeScript, Bun, and Clean Architecture. This project demonstrates how to implement CRUD operations for files in S3 with well-structured use cases and comprehensive testing.

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.2.16 or higher
- [LocalStack](https://localstack.cloud/) (optional, for local development)
- [Docker](https://www.docker.com/) (for LocalStack)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd s3-ts-example
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Setup LocalStack** (optional)
   ```bash
   # Start LocalStack with Docker
   docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
   
   # Create test bucket
   aws --endpoint-url=http://localhost:4566 s3 mb s3://test-bucket
   ```
## 🧪 Testing

### Run Tests
```bash
# All tests
bun run test

```

## 📦 Available Scripts

```bash
# Development
bun run format    # Format code with Biome
bun run lint      # Linting with Biome
bun run check     # Complete code verification
```

## 🔧 Configuration

### Environment Variables
```bash
# For real AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# For LocalStack (optional)
LOCALSTACK_ENDPOINT=http://localhost:4566
```

---

**Happy Coding! 🚀**
