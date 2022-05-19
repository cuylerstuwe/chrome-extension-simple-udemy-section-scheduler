export function fullyConsumeEvent(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
}