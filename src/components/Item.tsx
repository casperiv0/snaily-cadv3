export const Item: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = ({ children, ...rest }) => {
  return (
    <p style={{ marginBottom: "0" }} {...rest}>
      {children}
    </p>
  );
};

export const Span: React.FC = ({ children }) => {
  return <span className="fw-bold">{children}</span>;
};
