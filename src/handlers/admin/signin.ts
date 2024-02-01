import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { createJWT } from "../../modules/auth";
import { createHash, verifyPassword } from "../../utilities/passwordutils";

export const adminSignin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await prisma.adminUser.findUnique({
    where: {
      username,
    },
    include: {
      UserRole: {
        // Include the user's roles
        include: {
          role: {
            include: {
              RolePermission: {
                // Include permissions associated with each role
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.log("user", user);
  // Assuming you only need the role names and permission names in arrays
  const roles = user.UserRole.map((userRole) => userRole.role.name);
  const permissions = user.UserRole.flatMap((userRole) =>
    userRole.role.RolePermission.map(
      (rolePermission) => rolePermission.permission.name
    )
  );

  // Deduplicate permissions array
  const uniquePermissions = [...new Set(permissions)];
  // Check for specific roles
  const isSuperAdmin = roles.includes("superadmin");
  const isAdmin = roles.includes("admin");

  console.log({
    username: user.username,
    roles, // This is an array of role names
    permissions: uniquePermissions, // This is an array of unique permission names
  });

  if (user) {
    const result = await verifyPassword(password, user.password);
    if (result) {
      const userdetails = {
        username: user.username,
        roles, // This is an array of role names
        permissions: uniquePermissions, // This is an array of unique permission names
        isSuperAdmin, // true if the roles array contains 'superadmin'
        isAdmin, // true if the roles array contains 'admin'
        canadmin: true,
      };

      const token = createJWT(userdetails);

      // Store it on session object
      req.session.jwt = token;
      // 5. return the onboarding status
      res.json({ message: "success" });
    } else {
      throw new NotAuthorizedError();
    }
  } else {
    throw new NotAuthorizedError();
  }
};

export const createAdminUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await prisma.adminUser.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    // create user with hash password
    const hash = await createHash(password);
    const data = {
      username,
      password: hash,
    };
    const user = await prisma.adminUser.create({
      data: {
        username,
        password: hash,
      },
    });
    return res.json({ message: `User created ${user.username}` });
  } else {
    throw new BadRequestError("Cannot create user.");
  }
};
