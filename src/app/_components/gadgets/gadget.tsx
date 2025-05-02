import React from "react";

export default abstract class Gadget {
  abstract content(): React.ReactNode

  render(): React.ReactNode {
    return (
      <>
        {this.content()}
        {/* close button, drag handle, …*/}
      </>
    );
  }
}
