interface CallEvent {
  id: string;

  /**
   * timestamp (Milliseconds) of when the event occurred
   */
  date: string;
  text: string;
}

export default CallEvent;
