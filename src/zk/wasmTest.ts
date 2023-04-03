export const testBoardWasm = async () => {
    const wasmPackage = await import('battlezipsv2-wasm');
    await wasmPackage.default();
    const res = wasmPackage.prove_board([
        [3, 3, true],
        [5, 4, false],
        [0, 1, false],
        [0, 5, true],
        [6, 1, false]
    ]);
    console.log('Res: ', res);
    const verified = wasmPackage.verify_board(res.commitment, res.proof);
    console.log('Verified: ', verified);
}

export const testShotWasm = async () => {
    const wasmPackage = await import('battlezipsv2-wasm');
    await wasmPackage.default();
    const res = wasmPackage.prove_shot(1, [
        [3, 3, true],
        [5, 4, false],
        [0, 1, false],
        [0, 5, true],
        [6, 1, false]
    ], [3, 5]);
    console.log('Res: ', res);
    const verified = wasmPackage.verify_shot(res.commitment, res.proof);
    console.log('Verified: ', verified);
}