const STATUS = {
  TRANSLATING: 'translating',
  ORIGINAL: 'original'
};

class FloatController {
  constructor() {
    this.container = document.getElementById('swiftgg-float-container');
    this.content = document.getElementById('swiftgg-float-content');
    this.xmarkIcon = document.getElementById('swiftgg-status-icon-xmark');
    this.statusText = document.getElementById('swiftgg-float-content-left');
    this.checkIcon = document.getElementById('swiftgg-status-icon-check');
    this.statusIconContainer = document.getElementById('status-icon-container');

    this.statusText.style.display = 'none';
    this.xmarkIcon.style.display = 'none';

    this.currentStatus = STATUS.TRANSLATING;

    this.isDragging = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;

    this.initializeEventListeners();
    this.updateUI(); // 初始化UI状态
  }

  initializeEventListeners() {
    this.content.addEventListener('click', () => this.toggleStatus());
    this.content.addEventListener('mouseenter', () => this.enterFocus());
    this.content.addEventListener('mouseleave', () => this.leaveFocus());
    this.xmarkIcon.addEventListener('click', () => this.close());
    this.content.addEventListener('mousedown', (e) => this.dragStart(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.dragEnd());
  }

  toggleStatus() {
    switch (this.currentStatus) {
      case STATUS.TRANSLATING:
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
        check: 'block'
      },
      [STATUS.ORIGINAL]: {
        text: '点击查看翻译',
        check: 'none'
      }
    };

    const config = statusConfig[this.currentStatus];
    this.statusText.textContent = config.text;
    this.checkIcon.style.display = config.check;
    this.statusIconContainer.style.display = config.check === 'none' ? 'none' : 'block';
  }

  dragStart(e) {
    if (e.target === this.xmarkIcon) return; // 如果点击的是关闭按钮，不启动拖拽

    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;
    this.isDragging = true;

    this.content.style.cursor = 'grabbing';
  }

  drag(e) {
    if (!this.isDragging) return;

    e.preventDefault();

    this.currentX = e.clientX - this.initialX;
    this.currentY = e.clientY - this.initialY;

    this.xOffset = this.currentX;
    this.yOffset = this.currentY;

    // 计算边界
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elementRect = this.content.getBoundingClientRect();
    const snapThreshold = 20; // 吸附阈值

    // 右边界吸附
    if (windowWidth - (this.currentX + elementRect.width) < snapThreshold) {
      this.currentX = windowWidth - elementRect.width;
    }
    // 左边界吸附
    if (this.currentX < snapThreshold) {
      this.currentX = 0;
    }
    // 上边界吸附
    if (this.currentY < snapThreshold) {
      this.currentY = 0;
    }
    // 下边界吸附
    if (windowHeight - (this.currentY + elementRect.height) < snapThreshold) {
      this.currentY = windowHeight - elementRect.height;
    }

    this.setTranslate(this.currentX, this.currentY);
  }

  dragEnd() {
    this.isDragging = false;
    this.content.style.cursor = 'grab';
  }

  setTranslate(xPos, yPos) {
    this.content.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }
}

window.floatController = new FloatController();
