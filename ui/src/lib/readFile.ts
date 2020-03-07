const readFile = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsText(file);
});

export { readFile };
