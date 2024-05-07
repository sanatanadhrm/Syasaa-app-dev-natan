import React from "react";
import Swal from "sweetalert2";

class Alert extends React.Component {
  static alert(title: string, message: string, type: "success" | "info" | "warning" | "error" | "question" | "image" | "html" = "info") {
    // @ts-ignore
    Swal.fire({
      title,
      text: message,
      icon: type,
      heightAuto: false,
    });
  }

  static success(title: string, message: string) {
    this.alert(title, message, "success");
  }

  static info(title: string, message: string) {
    this.alert(title, message, "info");
  }

  static warning(title: string, message: string) {
    this.alert(title, message, "warning");
  }

  static error(title: string, message: string) {
    this.alert(title, message, "error");
  }

  static question(title: string, message: string) {
    this.alert(title, message, "question");
  }

  static image(title: string, description: string, imageUrl: string, imageWidth: number, imageHeight: number, imageAlt: string) {
    Swal.fire({
      title,
      text: description,
      imageUrl,
      imageWidth,
      imageHeight,
      imageAlt,
      heightAuto: false,
    });
  }

  static html(title: string, htmlCode: string, type: "success" | "info" | "warning" | "error" | "question" = "info") {
    Swal.fire({
      title,
      html: htmlCode,
      icon: type,
      heightAuto: false,
    });
  }

  static toast(message: string, type: "success" | "info" | "warning" | "error" = "info") {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      heightAuto: false,
    });
  }

  static async confirm(title: string, text: string, confirmText: string = "Yes", cancelText: string =  "No", showCancelBtn: boolean = true): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: showCancelBtn,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      heightAuto: false,
    });
    return result.isConfirmed;
  }

  render() {
    return null; // Since this is not a visible component
  }
}

export default Alert;
