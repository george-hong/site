const clickOtherElement = {
    name: 'clickOtherElement',
    bind (el, binding) {
        const event = function (e) {
            const isSelf = e.target === el;
            binding.value && binding.value(isSelf);
        };
        el.__clickEvent__ = event
        document.addEventListener('click', event)
    },
    unbind (el) {
        document.removeEventListener('click', el.__clickEvent__);
    }
};

export default clickOtherElement;