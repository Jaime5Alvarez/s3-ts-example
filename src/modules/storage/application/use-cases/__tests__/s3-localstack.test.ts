import { beforeEach, describe, expect, it } from "vitest";
import {
	CreateBucketCommand,
	DeleteObjectCommand,
	HeadBucketCommand,
	ListObjectsV2Command,
	S3Client,
} from "@aws-sdk/client-s3";
import { S3StorageService } from "@/modules/storage/infraestructure/s3-storage-service";
import {
	GetItemUseCase,
	GetTempUrlUseCase,
	RemoveItemUseCase,
	SetItemUseCase,
} from "@/modules/storage/application/use-cases/index";

const BUCKET = "test-bucket";
const s3Client = new S3Client({
	endpoint: "http://localhost:4566",
	region: "eu-south-2",
	credentials: { accessKeyId: "test", secretAccessKey: "test" },
	forcePathStyle: true,
});

async function ensureBucketExists() {
	try {
		await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET }));
	} catch {
		await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET }));
	}
}

async function clearBucket() {
	const list = await s3Client.send(
		new ListObjectsV2Command({ Bucket: BUCKET }),
	);
	if (list.Contents) {
		for (const obj of list.Contents) {
			if (obj.Key) {
				await s3Client.send(
					new DeleteObjectCommand({ Bucket: BUCKET, Key: obj.Key }),
				);
			}
		}
	}
}

describe("S3StorageService + LocalStack integration", () => {
	let storage: S3StorageService;
	let getItemUseCase: GetItemUseCase;
	let setItemUseCase: SetItemUseCase;
	let removeItemUseCase: RemoveItemUseCase;
	let getTempUrlUseCase: GetTempUrlUseCase;

	beforeEach(async () => {
		await ensureBucketExists();
		await clearBucket();
		storage = new S3StorageService(BUCKET, s3Client);
		getItemUseCase = new GetItemUseCase(storage);
		setItemUseCase = new SetItemUseCase(storage);
		removeItemUseCase = new RemoveItemUseCase(storage);
		getTempUrlUseCase = new GetTempUrlUseCase(storage);
	});

	it("should upload and download a file", async () => {
		const key = "bun-test.txt";
		const content = new Blob(["Hola LocalStack"], { type: "text/plain" });
		await setItemUseCase.execute(key, content);
		const downloaded = await getItemUseCase.execute(key);
		expect(downloaded).toBeInstanceOf(Blob);
		expect(downloaded.size).toBe(content.size);
	});

	it("should delete a file", async () => {
		const key = "delete-me.txt";
		const content = new Blob(["bye"], { type: "text/plain" });
		await setItemUseCase.execute(key, content);
		await removeItemUseCase.execute(key);
		expect(getItemUseCase.execute(key)).rejects.toThrow();
	});

	it("should generate a temporary URL", async () => {
		const key = "url-test.txt";
		const content = new Blob(["url"], { type: "text/plain" });
		await setItemUseCase.execute(key, content);
		const url = await getTempUrlUseCase.execute(key);
		expect(url).toContain(key);
		expect(url).toContain("http");
	});

	it("should throw on non-existent file", async () => {
		expect(getItemUseCase.execute("nope.txt")).rejects.toThrow();
	});
});
