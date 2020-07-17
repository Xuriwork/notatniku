module.exports = {
    css: {
      loaderOptions: {
        sass: {
          prependData: `@import "@/styles/global_variables.scss";`
        }
      }
    }
  };