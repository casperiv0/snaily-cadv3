interface Deputy {
  id: string;
  name: string;
  linked_to: string;
  status: "on-duty" | "off-duty";
  status2: string;
}

export default Deputy;
