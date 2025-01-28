// 1. JSON 导出功能
export const ExportButton = ({ data }: { data: object }) => {
    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({ url, filename: 'params.json' });
    };

    return <button onClick={exportJSON}>导出JSON</button>;
};