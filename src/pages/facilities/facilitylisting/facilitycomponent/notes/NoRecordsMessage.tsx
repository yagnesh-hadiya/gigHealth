const NoRecordsMessage = ({ msg, styles }: { msg: string, styles?: React.CSSProperties }) => {
    return (
        <p style={{ textAlign: 'center', ...styles }}>{msg}</p>
    );
};

export default NoRecordsMessage;