import "./message.css"
import classnames from "classnames";

export function Message({profile, sender, content, timestamp}) {
    const right = sender === profile?.username;
    return (
        <div className={"mess"}>
            <div className={classnames('messTop', {right})}>
                <p>{sender}</p>
                <p className="messText">{content}</p>
            </div>

            <div className={classnames('messBottom', {right})}>
                {timestamp}
            </div>
        </div>
    )
}