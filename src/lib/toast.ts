import Swal from 'sweetalert2'

export function toastSuccess(title: string) {
  Swal.fire({
    icon: 'success',
    title,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  })
}

export function toastError(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#0f172a',
  })
}
