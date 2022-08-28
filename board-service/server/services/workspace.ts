import Workspace, { IWorkspaceDocument } from "../models/Workspace"
import { INewWorkspaceProps, IFindWorkspaceProps } from "../types"

class WorkspaceService {
  async findWorkspaceByCategory({
    category,
    ownerId,
  }: IFindWorkspaceProps): Promise<IWorkspaceDocument | null> {
    const workspace = await Workspace.findOne({ category, owner: ownerId })

    return workspace
  }

  createWorkspace(options: INewWorkspaceProps): IWorkspaceDocument {
    const workspace = new Workspace({ ...options })
    return workspace
  }
}

const workspaceService = new WorkspaceService()
export { workspaceService }
