const Figure = (props) => {
    const { image, name, variant = "w-16 h-16" } = props
    return (
        <figure>
            <img src={image} alt={name} className={variant} />
        </figure>
    )
}

export default Figure