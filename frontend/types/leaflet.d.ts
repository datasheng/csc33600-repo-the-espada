declare module 'leaflet' {
    export * from '@types/leaflet';
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}