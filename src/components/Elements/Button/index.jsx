const Button = (props) => {
    const { pokemon, onClick, children, variant = "btn btn-primary btn-sm" } = props
    return (
        <>
            <button
                className={variant}
                onClick={() => onClick(pokemon)}
            >
                {children}
            </button>
        </>
    )
}

export default Button