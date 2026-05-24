export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    from: number;
    to: number;
    total: number;
}

export interface DocumentModel {
    id: string;
    title: string;
    status: string;
    recipient_type: string;
    current_url: string;
    created_at: string;
    creator?: {
        name: string;
    };
    file_type?: string;
    file_size?: number;
    incoming_mail?: any;
    outgoing_mail?: any;
}
