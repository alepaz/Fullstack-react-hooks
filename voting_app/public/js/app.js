const ProductList = () => {
  let [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    if (Array.isArray(products) && !products.length) setProducts(Seed.products);
  });

  const handleProductUpVote = productId => {
    const nextProducts = products.map(product => {
      if (product.id === productId) {
        return Object.assign({}, product, { votes: product.votes + 1 });
      } else {
        return product;
      }
    });

    setProducts(nextProducts);
  };

  const productComponents = products
    .concat()
    .sort((a, b) => b.votes - a.votes)
    .map(product => (
      <Product
        key={"product-" + product.id}
        id={product.id}
        title={product.title}
        description={product.description}
        url={product.url}
        votes={product.votes}
        submitterAvatarUrl={product.submitterAvatarUrl}
        productImageUrl={product.productImageUrl}
        onVote={handleProductUpVote}
      />
    ));
  return <div className="ui unstackable items">{productComponents}</div>;
};

const Product = props => {
  const handleUpVote = () => {
    props.onVote(props.id);
  };
  return (
    <div className="item">
      <div className="image">
        <img src={props.productImageUrl} />
      </div>
      <div className="middle aligned content">
        <div className="header">
          <a onClick={handleUpVote}>
            <i className="large caret up icon" />
          </a>
          {props.votes}
        </div>
        <div className="description">
          <a href={props.url}>{props.title}</a>
          <p>{props.description}</p>
        </div>
        <div className="extra">
          <span>Submitted by:</span>
          <img className="ui avatar image" src={props.submitterAvatarUrl} />
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<ProductList />, document.getElementById("content"));
