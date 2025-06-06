/**
 * Representa um arquivo a ser enviado.
 * @interface FileUpload
 */
export interface FileUpload {
	/**
	 * Nome do arquivo.
	 */
	fileName: string;
	/**
	 * Tipo MIME do arquivo.
	 */
	fileType: string;
	/**
	 * Conteúdo do arquivo representado como um Buffer.
	 */
	body: Buffer;
}
