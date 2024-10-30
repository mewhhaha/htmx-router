import { jsx as _jsx, jsxs as _jsxs } from "runtime/client/jsx-runtime";
import { useSignal } from "runtime";
const count = useSignal(0);
export default function Counter({ children }) {
    return (_jsxs("div", { children: [_jsx("button", { onClick: () => {
                    count.set(count.get() + 1);
                }, children: "increment" }), children, count.get() > 3 ? "greater than 3" : "less than 3", _jsx("div", { children: count }), count.get() > 3 ? _jsx("div", { children: "wha, wha" }) : _jsx("p", { children: "cool" })] }));
}
