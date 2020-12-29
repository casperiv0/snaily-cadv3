interface Message {
  type: "success" | "warning" | "danger";
  msg: string;
}

export default Message;
