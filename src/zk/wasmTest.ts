export const generateBoardProof = async () => {
    const wasmPackage = await import('battlezipsv2-wasm');
    await wasmPackage.default();
    const proof = await wasmPackage.prove_board([
        [3, 3, true],
        [5, 4, false],
        [0, 1, false],
        [0, 5, true],
        [6, 1, false]
    ]);
    console.log('Board proof: ', proof);
    return proof;
}

export const generateShotProof = async () => {
    const wasmPackage = await import('battlezipsv2-wasm');
    await wasmPackage.default();
    const proof = await wasmPackage.prove_shot(1, [
        [3, 3, true],
        [5, 4, false],
        [0, 1, false],
        [0, 5, true],
        [6, 1, false]
    ], [3, 5]);
    console.log('Shot proof: ', proof);
    return proof;
}

export const verifyBoardProof = async (boardProof: any) => {
    const wasmPackage = await import('battlezipsv2-wasm');
    await wasmPackage.default();
    const verified = wasmPackage.verify_board(boardProof.commitment, boardProof.proof);
    return verified;
}

export const verifyShotProof = async (shotProof: any) => {
    const wasmPackage = await import('battlezipsv2-wasm');
    await wasmPackage.default();
    const verified = wasmPackage.verify_shot(shotProof.commitment, shotProof.proof);
    return verified;
}