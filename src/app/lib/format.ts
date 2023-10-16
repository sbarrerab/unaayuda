export function formatPrice(price: number){
    return (price / 100).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
    })
}