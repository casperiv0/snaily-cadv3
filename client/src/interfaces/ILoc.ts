interface ILoc extends Location {
  state: {
    requestedPath: string;
    message: string;
  };
}

export default ILoc;
