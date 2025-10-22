import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import schedulerService from '../../services/social-media/scheduler';
import PostsTable, { TablePost } from './PostsTable';
import LoadingSpinner from '../LoadingSpinner';
import SchedulePostModal from './SchedulePostModal';
import { emitPostStatusUpdate, emitPostRemoval, onPostStatusUpdate, onPostRemoval } from '../../utils/postStatusEvents';
import { postStatusPoller } from '../../services/social-media/postStatusPoller';

type ScheduledPost = {
	_id: string;
	userId: string;
	caption: string;
	image?: { originalname?: string; mimetype?: string } | null;
	platforms: string[];
	scheduledAt: string;
	status: 'scheduled' | 'published' | 'failed' | 'cancelled';
	results?: Record<string, any>;
	createdAt: string;
	publishedAt?: string;
};

const ScheduledPostsList: React.FC = () => {
	const [items, setItems] = useState<ScheduledPost[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'status'>('date_desc');
	const [selected, setSelected] = useState<ScheduledPost | null>(null);
	const [pageHistory, setPageHistory] = useState(1);
	const [pageSizeHistory, setPageSizeHistory] = useState(5);

	const fetchData = async () => {
		if (loading) return;
		try {
			setLoading(true);
			setError(null);
			const data = await schedulerService.listScheduled();
			setItems(data);
			
			const postIds = data.map(post => post._id);
			postStatusPoller.trackPosts(postIds);
		} catch (e: any) {
			setError(e.message || 'Failed to load scheduled posts');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		postStatusPoller.startPolling();
		return () => {
			postStatusPoller.stopPolling();
		};
	}, []);

	useEffect(() => {
		const handler = () => fetchData();
		window.addEventListener('scheduledPosts:refresh', handler as EventListener);
		return () => window.removeEventListener('scheduledPosts:refresh', handler as EventListener);
	}, []);

	useEffect(() => {
		const unsubscribeStatus = onPostStatusUpdate(({ postId, status, publishedAt }) => {		
			setItems(prevItems => 
				prevItems.map(item => 
					item._id === postId 
						? { 
							...item, 
							status, 
							publishedAt: publishedAt || item.publishedAt 
						}
						: item
				)
			);
			
		});

		const unsubscribeRemoval = onPostRemoval(({ postId }) => {
			setItems(prevItems => prevItems.filter(item => item._id !== postId));
		});
		
		return () => {
			unsubscribeStatus();
			unsubscribeRemoval();
		};
	}, []);

	useEffect(() => {
		return () => {
			postStatusPoller.clearTrackedPosts();
		};
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		const byQuery = q
			? items.filter(i =>
					(i.caption || '').toLowerCase().includes(q) ||
					(i.results && JSON.stringify(i.results).toLowerCase().includes(q))
				)
			: items;
		const sorted = [...byQuery].sort((a, b) => {
			if (sortBy === 'status') return a.status.localeCompare(b.status);
			const da = new Date(a.publishedAt || a.scheduledAt || a.createdAt).getTime();
			const db = new Date(b.publishedAt || b.scheduledAt || b.createdAt).getTime();
			return sortBy === 'date_asc' ? da - db : db - da;
		});
		return sorted;
	}, [items, query, sortBy]);

  const allRows: TablePost[] = useMemo(() => {
    return filtered.map(i => ({
      _id: i._id,
      caption: i.caption,
      platforms: i.platforms,
      scheduledAt: i.scheduledAt,
      publishedAt: i.publishedAt,
      status: i.status,
    }));
  }, [filtered]);

	const handleCancel = async (id: string) => {
		try {
			await schedulerService.cancelScheduled(id);
			
			emitPostStatusUpdate({ postId: id, status: 'cancelled' });
			
			await fetchData();
		} catch (e) {
		}
	};

  const handleDelete = async (id: string) => {
    try {
      const result = await schedulerService.deletePost(id);
      if (result.success) {
        setItems(prevItems => prevItems.filter(item => item._id !== id));
        
        postStatusPoller.untrackPost(id);
        
        emitPostRemoval({ postId: id });
        
        await fetchData();
      } else {
        setError(result.message || 'Failed to delete post');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to delete post');
    }
  };

	return (
		<div className="w-full rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-800">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<h2 className="text-white text-lg md:text-xl font-bold">Scheduled Posts</h2>
				</div>
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full max-w-md sm:max-w-xl ml-auto">
					<div className="relative flex-1">
						<FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search posts by caption..."
							className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg pr-10 pl-2.5 sm:pl-3 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-gray-500"
						/>
					</div>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-2 py-2 text-xs sm:text-sm text-gray-200"
						aria-label="Sort by"
					>
						<option value="date_desc">Sort by: Date (newest)</option>
						<option value="date_asc">Sort by: Date (oldest)</option>
						<option value="status">Sort by: Status</option>
					</select>
				</div>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-10">
					<LoadingSpinner variant="dark" size="small" />
				</div>
			) : (
				<PostsTable
				  title="All Posts"
				  rows={allRows}
				  onRowClick={(row) => setSelected(items.find(i => i._id === row._id) || null)}
				  onEdit={(row) => {
				    if (row.status === 'scheduled') handleCancel(row._id);
				  }}
				  onDelete={(row) => {
				    if (['published', 'failed', 'cancelled'].includes(row.status)) {
				      handleDelete(row._id);
				    }
				  }}
				  page={pageHistory}
				  pageSize={pageSizeHistory}
				  total={allRows.length}
				  onPageChange={setPageHistory}
				  onPageSizeChange={(s) => { setPageHistory(1); setPageSizeHistory(s); }}
				  loading={false}
				/>
			)}

			{error && <div className="text-red-400 text-sm mb-3">{error}</div>}

			<SchedulePostModal
				post={selected as any}
				onClose={() => setSelected(null)}
			/>
		</div>
	);
};

export default ScheduledPostsList;


