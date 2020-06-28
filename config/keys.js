if(process.env.NODE_ENV === 'production'){
  export * from './prod';
}else{
  export * from './dev';
}
