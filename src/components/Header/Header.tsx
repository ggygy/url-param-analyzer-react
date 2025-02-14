import { FunctionComponent, useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { storage } from "../../utils/storage";
import { useHoverSetting } from "../../hooks/useHoverSetting";
import { useIncognitoSetting } from "../../hooks/useIncognitoSetting";
import './Header.css';

const Header: FunctionComponent = () => {
    const { isStorageEnabled, setStorageEnabled } = useStorage();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { isHoverEnabled, toggleHoverEnabled } = useHoverSetting();
    const { isIncognitoEnabled, toggleIncognitoEnabled } = useIncognitoSetting();

    const handleClearCache = () => {
        if (window.confirm("确定要清除缓存吗？")) {
            storage.clear();
            alert("缓存已清除");
        }
    };

    return (
        <header className="header">
            <div className="section-title header-title">URL参数对比工具</div>
            <div className="settings">
                <button className="settings-icon" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                    ⚙️
                </button>
                {isSettingsOpen && (
                    <div className="settings-popup">
                        <label className="setting-toggle">
                            <input
                                type="checkbox"
                                checked={isStorageEnabled}
                                onChange={(e) => setStorageEnabled(e.target.checked)}
                            />
                            <span className="setting-label">启用参数缓存</span>
                        </label>
                        <label className="setting-toggle">
                            <input
                                type="checkbox"
                                checked={isHoverEnabled}
                                onChange={(e) => toggleHoverEnabled(e.target.checked)}
                            />
                            <span className="setting-label">启用 Hover 显示</span>
                        </label>
                        <label className="setting-toggle">
                            <input
                                type="checkbox"
                                checked={isIncognitoEnabled}
                                onChange={(e) => toggleIncognitoEnabled(e.target.checked)}
                            />
                            <span className="setting-label">以无痕模式打开新标签页</span>
                        </label>
                        <button className="clear-cache-button" onClick={handleClearCache}>
                            清除缓存
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;