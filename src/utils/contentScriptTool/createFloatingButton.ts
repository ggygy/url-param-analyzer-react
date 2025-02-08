export const createFloatingButton = () => {
  const button = document.createElement('div');
  const iconUrl = chrome.runtime.getURL("icons/icon256.png");
  
  button.style.cssText = `
    position: fixed;
    right: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background-image: url('${iconUrl}');
    background-size: cover;
    cursor: pointer;
    z-index: 9999;
    border-radius: 10px;
    box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
    transition: right 0.3s ease;
  `;
  
  button.addEventListener('mouseenter', () => {
    button.style.right = '0';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.right = '-18px';
  });

  document.body.appendChild(button);
  return button;
};
