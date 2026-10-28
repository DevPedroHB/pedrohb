export type UploadParams = {
	filename: string;
	contentType: string;
	file: Uint8Array;
};

export type UploadResult = {
	url: URL;
};

export abstract class Uploader {
	public abstract upload(params: UploadParams): Promise<UploadResult>;
	public abstract uploadMany(params: UploadParams[]): Promise<UploadResult[]>;
}
