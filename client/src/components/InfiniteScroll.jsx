import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import FadeIn from './animations/FadeIn';

const InfiniteScroll = ({ 
  items, 
  renderItem, 
  loadMore, 
  hasMore, 
  loadingComponent: LoadingComponent 
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreData();
    }
  }, [inView]);

  const loadMoreData = async () => {
    setLoading(true);
    try {
      await loadMore(page + 1);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <FadeIn key={item.id || index} delay={index * 0.1}>
          {renderItem(item)}
        </FadeIn>
      ))}
      
      {hasMore && (
        <div ref={ref} className="py-4">
          {loading && LoadingComponent}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll; 