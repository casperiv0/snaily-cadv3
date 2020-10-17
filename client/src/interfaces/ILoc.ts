interface ILoc extends Location {
  params: {
    bleetId: string;
  };
  state: {
    requestedPath: string;
    message: string;
  };
}

export default ILoc;
