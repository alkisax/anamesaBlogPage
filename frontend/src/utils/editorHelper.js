  // αυτή η συνάρτηση κρατάει μόνο την πρώτη εικόνα και τις πρώτες 70 λέξεις. Σε μεγάλο βαθμό απο GPT
  export const getPreviewContent = (content, maxWords = 70) => {
    const previewBlocks = [];
    let wordCount = 0;
    let imageIncluded = false;

    for (const block of content.blocks) {
      if (block.type === 'image' && !imageIncluded) {
        previewBlocks.push(block);
        imageIncluded = true;
      }

      if (block.type === 'header') {
        previewBlocks.push(block);
      }

      if (block.type === 'paragraph') {
        const words = block.data.text.split(/\s+/);
        const remaining = maxWords - wordCount;

        if (remaining <= 0) break;

        const trimmedWords = words.slice(0, remaining);
        previewBlocks.push({
          ...block,
          data: {
            ...block.data,
            text: trimmedWords.join(' ') + (words.length > remaining ? '...' : '')
          }
        });

        wordCount += trimmedWords.length;
      }

      if (wordCount >= maxWords && imageIncluded) break;
    }

    return {
      ...content,
      blocks: previewBlocks
    };
  };