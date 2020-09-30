const getOffsetDistance = element => {
    let topDistance = 0;
    let leftDistance = 0;
    let currentElement = element;
    while (currentElement && currentElement !== document.body) {
        topDistance += currentElement.offsetTop;
        leftDistance += currentElement.offsetLeft;
        currentElement = currentElement.offsetParent;
    }
    return {
        top: topDistance,
        left: leftDistance
    };
};

const mousemoveEvent = function (event) {
    const { clientX, clientY } = event;
    const { mouseToElTop, mouseToElLeft } = this.extraData;
    this.style.left = clientX - mouseToElLeft + 'px';
    this.style.top = clientY - mouseToElTop + 'px';
};

const mouseupEvent = function (event) {
    this.removeEventListener('mousemove', mousemoveEvent);
};

const mousedownEvent = function (event) {
    const { clientX, clientY } = event;
    const { top, left } = getOffsetDistance(this);
    this.extraData.mouseToElTop = clientY - top;
    this.extraData.mouseToElLeft = clientX - left;
    this.addEventListener('mousemove', mousemoveEvent);
};

const draggable = {
    name: 'draggable',
    bind (el) {
        el.extraData = {
            mouseToElTop: 0,        // 鼠标到元素顶部的距离
            mouseToElLeft: 0        // 鼠标到元素左侧的距离
        };
        el.addEventListener('mousedown', mousedownEvent);
        el.addEventListener('mouseup', mouseupEvent);
    },
    unbind (el) {
        el.removeEventListener('mousedown', mousedownEvent);
        el.removeEventListener('mouseup', mouseupEvent);
    }
};

export default draggable;