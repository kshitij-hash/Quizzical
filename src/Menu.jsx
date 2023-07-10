export default function Menu({start}) {
    return (
        <div className="menu">
            <h1 className="page-title">Quizzical</h1>
            <span className="page-desc">Some description</span>
            <button className="start-button" onClick={() => start()}>Start Quiz</button>
        </div>
    )
}