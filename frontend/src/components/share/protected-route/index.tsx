interface IProps {
    children: React.ReactNode;
}

const ProtectedRoute = (props : IProps) => {
  return (
    <>
      {props.children}
    </>
)
}

export default ProtectedRoute