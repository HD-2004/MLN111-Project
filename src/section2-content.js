(function () {
  function stripSectionNumber(title = "") {
    return title.replace(/^\s*\d+\.\s*/, "").trim();
  }

  function getShortDescription(section) {
    if (section.intro?.lead) return section.intro.lead;

    const firstBlock = section.blocks?.[0];
    return (
      firstBlock?.paragraphs?.[0] ||
      firstBlock?.bullets?.[0] ||
      firstBlock?.quote ||
      "Thêm mô tả ngắn cho node này trong dữ liệu Section 2."
    );
  }

  function getBlockDescription(block) {
    return block?.paragraphs?.[0] || block?.bullets?.[0] || block?.quote || "";
  }

  function normalizeCustomNodes(nodes = []) {
    return nodes.map((node, index) => ({
      id: node.id || `section-2-custom-node-${index + 1}`,
      title: node.title || "",
      subtitle: node.subtitle || "",
      shortDescription: node.shortDescription || "",
      fullContent: node.fullContent || "",
      icon: node.icon || String(index + 1).padStart(2, "0"),
      color: node.color || "#63d7ff",
      childNodes: Array.isArray(node.childNodes)
        ? node.childNodes.map((childNode, childIndex) => ({
            id: childNode.id || `${node.id || `section-2-custom-node-${index + 1}`}-child-${childIndex + 1}`,
            title: childNode.title || "",
            subtitle: childNode.subtitle || "",
            shortDescription: childNode.shortDescription || "",
            fullContent: childNode.fullContent || "",
            icon: childNode.icon || String(childIndex + 1).padStart(2, "0"),
          }))
        : [],
    }));
  }

  function createChildNodes(section, sectionIndex) {
    const blocks = Array.isArray(section.blocks) ? section.blocks : [];

    return blocks.map((block, blockIndex) => ({
      id: `section-2-node-${sectionIndex + 1}-child-${blockIndex + 1}`,
      title: block.heading || `Luận điểm ${blockIndex + 1}`,
      subtitle: "",
      shortDescription: getBlockDescription(block),
      fullContent: block,
      icon: String(blockIndex + 1).padStart(2, "0"),
    }));
  }

  function createNodesFromTheory(theory) {
    if (Array.isArray(theory?.gearNodes) && theory.gearNodes.length) {
      return normalizeCustomNodes(theory.gearNodes);
    }

    const sections = Array.isArray(theory?.sections) ? theory.sections : [];
    const colors = ["#63d7ff", "#d4a84f", "#f28d35", "#8fe7c8"];
    const icons = ["VC", "YT", "BC", "ML"];

    return sections.map((section, index) => ({
      id: `section-2-node-${index + 1}`,
      title: stripSectionNumber(section.title),
      subtitle: section.blocks?.[0]?.heading || section.intro?.eyebrow || "",
      shortDescription: getShortDescription(section),
      fullContent: section,
      icon: icons[index % icons.length],
      color: colors[index % colors.length],
      childNodes: createChildNodes(section, index),
    }));
  }

  window.Section2ContentData = {
    createNodesFromTheory,
    // You can also add custom major/minor nodes in src/data.js under theory.gearNodes.
  };
})();
