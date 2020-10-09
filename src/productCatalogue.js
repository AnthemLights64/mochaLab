class Catalogue {
  constructor(title) {
    this.title = title;
    this.products = [];
  }

  findProductById(id) {
    const match = this.products.find((product) => id === product.id);
    return match;
  }

  addProduct(product) {
    if (!this.findProductById(product.id)) {
      this.products.push(product);
      return true;
    }
    return false;
  }

  removeProductById(id) {
    const removedProduct = this.findProductById(id);
    if (removedProduct) {
      this.products = this.products.filter(
        (product) => product.id !== id 
      );
    }
    return removedProduct;
  }

  checkReorders() {
    const result = { type: "Reorder", productIds: [] };
    // this.products.forEach( (p) => {
    //   if (p.quantityInStock <= p.reorderLevel) {
    //     result.productIds.push(p.id);
    //   }
    // });
    result.productIds = this.products
      .filter((p) => p.quantityInStock <= p.reorderLevel)
      .map((p) => p.id);
    return result;
  }

  // batchAddProducts(batch) {
  //   return undefined
  // }
  // ----------------------------
  // batchAddProducts(batch) {
  //   batch.products.forEach( p => 
  //      this.addProduct(p)
  //   )
  //   return batch.products.length
  // }
  //------------------------------
  // batchAddProducts(batch) {
  //   const validAdditions = batch.products.filter(
  //     (product) => product.quantityInStock > 0
  //   )
  //   validAdditions.forEach((p) => this.addProduct(p) );
  //   return validAdditions.length;
  // }
  //-----------------------------The blow one works
  // batchAddProducts(batch) {
  //   const invalidAdditions = batch.products.filter(
  //     (product) => this.findProductById(product.id) !== undefined
  //   );
  //   if (invalidAdditions.length > 0 ) {
  //     throw new Error('Bad Batch')
  //   }
  //   const validAdditions = batch.products.filter(
  //     (product) => product.quantityInStock > 0
  //   );
  //   validAdditions.forEach( (p) => this.addProduct(p) );
  //   return validAdditions.length;
  // }
  //--------------------The blow one is more elegant
  batchAddProducts(batch) {
    const productIDClash = batch.products.some(
      (product) => this.findProductById(product.id) !== undefined
    );
    if (productIDClash) {
      throw new Error("Bad Batch");
    }
    const noProductsAdded = batch.products
      .filter((product) => product.quantityInStock > 0 )
      .filter((p) => {
        this.addProduct(p);
        return true;
      })
      .reduce((acc, p) => acc + 1, 0);
    return noProductsAdded;
  }

  search(specifiedObj){
    const result = { type: "Search", productIds: [] };
    if(specifiedObj.price){
      result.productIds = this.products
        .filter((p) => p.price <= specifiedObj.price)
        .map((p) => p.id);
    }else if(specifiedObj.keyword){
      result.productIds = this.products
        .filter((p) => p.name.search(specifiedObj.keyword)>=0)
        .map((p) => p.id);
      if(result.productIds.length===0) {
        throw new Error("Bad Search");
      }
    }
    
    
    return result;
  }
  
}
module.exports = Catalogue;
