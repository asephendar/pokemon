const Eye = (props) => {
    const { pokemon, onClick, children, variant = "btn btn-ghost btn-xs" } = props
    return (
        <button
            className={variant}
            onClick={() => onClick(pokemon)}
        >
            {children}
        </button>
    )
}

export default Eye