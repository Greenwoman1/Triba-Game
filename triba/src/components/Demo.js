import { useState } from 'react';

export const Demo = () => {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <span>{counter}</span>
            <button onClick={() => setCounter(counter + 1)}>Button</button>
        </div>
    );
}
