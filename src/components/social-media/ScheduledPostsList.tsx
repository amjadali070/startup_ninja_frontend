import React, { useEffect, useMemo, useState } from 'react';
import schedulerService from '../../services/scheduler';
import PostsTable, { TablePost } from './PostsTable';
import SchedulePostModal from './SchedulePostModal';
import LoadingSpinner from '../LoadingSpinner';

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
	const [pageUpcoming, setPageUpcoming] = useState(1);
	const [pageHistory, setPageHistory] = useState(1);
	const [pageSizeUpcoming, setPageSizeUpcoming] = useState(5);
	const [pageSizeHistory, setPageSizeHistory] = useState(5);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await schedulerService.listScheduled();
			setItems(data);
		} catch (e: any) {
			setError(e.message || 'Failed to load scheduled posts');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// Listen for newly scheduled posts to refresh without full page reload
	useEffect(() => {
		const handler = () => fetchData();
		window.addEventListener('scheduledPosts:refresh', handler as EventListener);
		return () => window.removeEventListener('scheduledPosts:refresh', handler as EventListener);
	}, []);

	const now = Date.now();
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
	}, [items, query, sortBy, now]);

	const { upcoming, history } = useMemo(() => {
		const upcoming = filtered.filter(i => i.status === 'scheduled');
		const history = filtered.filter(i => i.status !== 'scheduled');
		return { upcoming, history };
	}, [filtered]);

	const handleCancel = async (id: string) => {
		try {
			await schedulerService.cancelScheduled(id);
			await fetchData();
		} catch (e) {
			// swallow for now, could add a toast in parent
		}
	};

	return (
		<div className="w-full rounded-2xl p-4 lg:p-6 border border-gray-800">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-white text-lg md:text-xl font-bold">Scheduled Posts</h2>
				<div className="flex items-center gap-2 w-full max-w-xl ml-auto">
					<div className="flex-1">
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search posts..."
							className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500"
						/>
					</div>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-200"
						aria-label="Sort by"
					>
						<option value="date_desc">Sort by: Date (newest)</option>
						<option value="date_asc">Sort by: Date (oldest)</option>
						<option value="status">Sort by: Status</option>
					</select>
					<button onClick={fetchData} className="text-sm text-gray-300 hover:text-white">Refresh</button>
				</div>
			</div>

			{loading && (
				<div className="py-10">
					<LoadingSpinner fullscreen={false} variant="dark" size='small' />
				</div>
			)}
			{error && <div className="text-red-400 text-sm mb-3">{error}</div>}

			<div className="mb-6">
				<PostsTable
					title="Upcoming"
					rows={upcoming as unknown as TablePost[]}
					onRowClick={(row) => setSelected(items.find(i => i._id === row._id) || null)}
					onCancel={(id) => handleCancel(id)}
					page={pageUpcoming}
					pageSize={pageSizeUpcoming}
					total={upcoming.length}
					onPageChange={setPageUpcoming}
					onPageSizeChange={(s) => { setPageUpcoming(1); setPageSizeUpcoming(s); }}
				/>
			</div>

			<div>
				{history.length === 0 ? (
					<div className="text-gray-400 text-sm">No history yet.</div>
				) : (
					<PostsTable
						title="History"
						rows={history as unknown as TablePost[]}
						onRowClick={(row) => setSelected(items.find(i => i._id === row._id) || null)}
						page={pageHistory}
						pageSize={pageSizeHistory}
						total={history.length}
						onPageChange={setPageHistory}
						onPageSizeChange={(s) => { setPageHistory(1); setPageSizeHistory(s); }}
					/>
				)}
			</div>

			{/* Details Modal */}
			<SchedulePostModal
				post={selected as any}
				onClose={() => setSelected(null)}
				onCancel={(id) => { setSelected(null); handleCancel(id); }}
			/>
		</div>
	);
};

export default ScheduledPostsList;


