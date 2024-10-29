const STATUS = {
  TRANSLATING: 'translating',
  PAUSED: 'paused',
  ORIGINAL: 'original'
};

class FloatController {
  constructor() {
    this.container = document.getElementById('swiftgg-float-container');
    this.content = document.getElementById('swiftgg-float-content');
    this.xmarkIcon = document.getElementById('swiftgg-status-icon-xmark');
    this.statusText = document.getElementById('swiftgg-float-content-left');
    this.checkIcon = document.getElementById('swiftgg-status-icon-check');
    this.pauseIcon = document.getElementById('swiftgg-status-icon-pause');
    this.statusIconContainer = document.getElementById('status-icon-container');

    this.statusText.style.display = 'none';
    this.pauseIcon.style.display = 'none';
    this.xmarkIcon.style.display = 'none';

    this.currentStatus = STATUS.TRANSLATING;

    this.initializeEventListeners();
    this.updateUI(); // 初始化UI状态
  }

  initializeEventListeners() {
    this.content.addEventListener('click', () => this.toggleStatus());
    this.content.addEventListener('mouseenter', () => this.enterFocus());
    this.content.addEventListener('mouseleave', () => this.leaveFocus());
    this.xmarkIcon.addEventListener('click', () => this.close());
  }

  toggleStatus() {
    switch (this.currentStatus) {
      case STATUS.TRANSLATING:
        this.setStatus(STATUS.PAUSED);
        break;
      case STATUS.PAUSED:
        this.setStatus(STATUS.ORIGINAL);
        break;
      case STATUS.ORIGINAL:
        this.setStatus(STATUS.TRANSLATING);
        break;
    }
  }

  close() {
    this.container.style.display = 'none';
  }

  setStatus(status) {
    this.currentStatus = status;
    this.updateUI();
  }

  enterFocus() {
    this.statusText.style.display = 'block';
    this.xmarkIcon.style.display = 'block';
  }

  leaveFocus() {
    this.statusText.style.display = 'none';
  }

  updateUI() {
    const statusConfig = {
      [STATUS.TRANSLATING]: {
        text: '点击切换回原文',
        check: 'block',
        pause: 'none'
      },
      [STATUS.PAUSED]: {
        text: '点击重新加载',
        check: 'none',
        pause: 'block'
      },
      [STATUS.ORIGINAL]: {
        text: '点击查看翻译',
        check: 'none',
        pause: 'none'
      }
    };

    const config = statusConfig[this.currentStatus];
    this.statusText.textContent = config.text;
    this.checkIcon.style.display = config.check;
    this.pauseIcon.style.display = config.pause;
    if (config.pause === 'none' && config.check === 'none') {
      this.statusIconContainer.style.display = 'none';
    } else {
      this.statusIconContainer.style.display = 'block';
    }
  }
}

window.floatController = new FloatController();
