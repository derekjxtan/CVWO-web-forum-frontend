type Props = {
    error: string
}

export const Error = (props: Props) => {
    return (
        <h1 className="mt-3 white-text">Error: Unable to load page</h1>
    );
}