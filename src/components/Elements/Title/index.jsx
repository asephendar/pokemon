const Title = (props) => {
    const { children, variant = "text-3xl font-bold my-6", tag: Tag = 'h1' } = props
    return (
        <>
            <Tag className={variant}>{children}</Tag>
        </>
    )
}

export default Title